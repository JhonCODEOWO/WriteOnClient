import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-profile-image',
  imports: [],
  template: `<span
    class="inline-flex items-center justify-center size-11 rounded-full bg-gray-500 font-semibold text-white"
  >
    {{initials()}}
  </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileImageComponent {
  name = input.required<string>();
  imageUrl = input('');
  size = input<'xs' | 'md' | 'lg'>();

  initials = computed(() => {
    let initials = '';
    const byParts = this.name().split(' ');
    if(byParts.length === 0) return byParts[0][0];
    return `${byParts[0][0]}${byParts[1][0]}`;
  })
}
