import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-profile-image',
  imports: [],
  template: `<span
    class="inline-flex items-center justify-center size-11 rounded-full font-semibold text-white"
    style="background-color: {{ bgColor() }}"
  >
    {{ initials() }}
  </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileImageComponent implements OnInit {
  name = input.required<string>();
  imageUrl = input('');
  size = input<'xs' | 'md' | 'lg'>();
  bgColor = signal<string>('');

  initials = computed(() => {
    let initials = '';
    const byParts = this.name().split(' ');
    if (byParts.length === 0) return byParts[0][0];
    return `${byParts[0][0]}${byParts[1][0]}`;
  });

  ngOnInit(): void {
    const randomHexColorCode = () => {
      let n = (Math.random() * 0xfffff * 1000000).toString(16);
      return '#' + n.slice(0, 6);
    };

    this.bgColor.set(randomHexColorCode());
  }
}
