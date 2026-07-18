<script setup lang="ts">
import { reactive } from 'vue'
import { ApiReference } from '@scalar/api-reference'
import openApiSpec from '../../openapi.yaml'

const TOKEN_KEY = 'scalar_access_token'
const savedToken = localStorage.getItem(TOKEN_KEY) ?? ''

const config = reactive<any>({
  spec: {
    content: openApiSpec,
  },
  theme: 'elysiajs',
  showSidebar: true,
  layout: 'modern',
  darkMode: true,
  authentication: {
    preferredSecurityScheme: 'bearerAuth',
    securitySchemes: {
      bearerAuth: {
        token: savedToken,
      },
    },
  },
  // Intercept every request Scalar makes so we can extract the token
  // from the login / refresh response and auto-fill the auth field.
  fetch: async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const response = await globalThis.fetch(input, init)

    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : (input as Request).url

    if (url.includes('/auth/login') || url.includes('/auth/refresh')) {
      try {
        const body = await response.clone().json()
        const token: string | undefined = body?.data?.access_token
        if (token) {
          localStorage.setItem(TOKEN_KEY, token)
          config.authentication = {
            preferredSecurityScheme: 'bearerAuth',
            securitySchemes: {
              bearerAuth: { token },
            },
          }
        }
      } catch {
        // body wasn't JSON or didn't have the expected shape – ignore
      }
    } else if (response.status === 401) {
      // Token expired! Try to refresh automatically
      try {
        const baseUrl = url.split('/api/v1/')[0]
        const refreshUrl = `${baseUrl}/api/v1/auth/refresh`
        const refreshRes = await globalThis.fetch(refreshUrl, {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          // Cookie refresh_token will be sent automatically by browser if credentials 'include'
          credentials: 'include'
        })
        
        if (refreshRes.ok) {
           const refreshBody = await refreshRes.json()
           const newToken: string | undefined = refreshBody?.data?.access_token
           if (newToken) {
             localStorage.setItem(TOKEN_KEY, newToken)
             config.authentication = {
               preferredSecurityScheme: 'bearerAuth',
               securitySchemes: {
                 bearerAuth: { token: newToken },
               },
             }
             
             // Retry the original request with the new token
             const newInit = { ...init }
             const headers = new Headers(newInit.headers || {})
             headers.set('Authorization', `Bearer ${newToken}`)
             newInit.headers = headers
             
             return globalThis.fetch(input, newInit)
           }
        }
      } catch (e) {
        // Failed to refresh, just return the 401
      }
    }

    return response
  },
})
</script>

<template>
  <div class="api-docs-container">
    <ApiReference :configuration="config" />
  </div>
</template>

<style>
@import '@scalar/api-reference/style.css';

.api-docs-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: #000;
  overflow-x: hidden;
}

.scalar-app, .scalar-api-reference {
  width: 100% !important;
  height: 100% !important;
}
</style>