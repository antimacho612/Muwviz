<script setup lang="ts">
import MusicIcon from '@renderer/assets/icons/music.svg?component';
import AlbumIcon from '@renderer/assets/icons/album.svg?component';
import UserGroupIcon from '@renderer/assets/icons/user-group.svg?component';

const LINKS = [
  {
    to: '/songs',
    title: '全楽曲',
    icon: MusicIcon,
  },
  {
    to: '/albums',
    title: 'アルバム',
    icon: AlbumIcon,
  },
  {
    to: '/artists',
    title: 'アーティスト',
    icon: UserGroupIcon,
  },
] as const;

const emits = defineEmits<{ click: [e: MouseEvent] }>();
</script>

<template>
  <nav class="links">
    <RouterLink
      v-for="link in LINKS"
      :key="link.to"
      v-ripple
      :to="link.to"
      class="link"
      @click="emits('click', $event)"
    >
      <component :is="link.icon" class="link-icon"></component>
      <span class="link-text">{{ link.title }}</span>
    </RouterLink>
    <div class="active-link-color"></div>
  </nav>
</template>

<style lang="scss" scoped>
.links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $sideNavLinksGap;
}

.link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  height: $sideNavLinkSize;
  width: $sideNavLinkSize;
  color: var(--secondary-text-color);
  border-radius: $borderRadiusLg;
  transition: color $transitionDuration;

  &.router-link-active {
    color: var(--primary-color);
  }

  &:hover {
    color: var(--primary-color);
    text-decoration: none;
  }

  &:focus-visible {
    @include focused();
  }
}

.link-icon {
  flex-shrink: 0;
  width: $sideNavLinkIconSize;
  height: $sideNavLinkIconSize;
  margin-bottom: 0.25rem;
}

.link-text {
  text-wrap: nowrap;
  font-size: map-get($fontSizes, xs);
  line-height: 1;
}

.active-link-color {
  position: absolute;
  height: $sideNavLinkSize;
  width: $sideNavLinkSize;
  border-radius: $borderRadiusLg;
  box-shadow: $innerShadow;
  transition: transform $transitionDuration cubic-bezier(0.66, -0.3, 0.33, 1.4);
  pointer-events: none;
}

@for $i from 1 through 5 {
  .link:nth-child(#{$i}).router-link-active ~ .active-link-color {
    $idx: $i - 1;
    $y: ($sideNavLinkSize + $sideNavLinksGap) * $idx;
    transform: translateY($y);
  }
}
</style>
