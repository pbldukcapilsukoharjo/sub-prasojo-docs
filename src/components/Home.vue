<script setup lang="ts"></script>

<template>
  <main
    class="relative min-h-dvh flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-950"
  >
    <div class="home-grid" aria-hidden="true" />
    <div class="home-vignette" aria-hidden="true" />
    <div class="relative z-10 w-full max-w-130 px-8 py-24">
      <p
        class="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 select-none"
      >
        API Reference
      </p>
      <h1
        class="mb-5 text-[2.625rem] font-semibold leading-[1.06] tracking-tight text-zinc-900 dark:text-zinc-50 md:text-[3.25rem]"
      >
        Welcome to<br />Sub&nbsp;Prasojo&nbsp;Docs
      </h1>
      <p
        class="mb-10 max-w-[38ch] text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400"
      >
        Explore the complete API reference for integrating and working with Sub
        Prasojo services.
      </p>
      <RouterLink
        to="/apidocs"
        class="inline-flex items-center gap-2.5 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:bg-zinc-700 active:scale-[0.97] dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
      >
        View Documentation
        <span aria-hidden="true" class="leading-none">&rarr;</span>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.home-grid {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.07) 1.1px,
    transparent 1px
  );
  background-size: 28px 28px;
  z-index: 999;
}

.home-vignette {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: radial-gradient(
      ellipse 100% 55% at 50% 0%,
      transparent 55%,
      white 100%
    ),
    radial-gradient(ellipse 100% 55% at 50% 100%, transparent 55%, white 100%);
}

@media (prefers-color-scheme: dark) {
  .home-grid {
    background-image: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.055) 1.1px,
      transparent 1px
    );
    z-index: 999;
  }

  .home-vignette {
    background: radial-gradient(
        ellipse 100% 55% at 50% 0%,
        transparent 55%,
        #09090b 100%
      ),
      radial-gradient(
        ellipse 100% 55% at 50% 100%,
        transparent 55%,
        #09090b 100%
      );
  }
}
</style>
