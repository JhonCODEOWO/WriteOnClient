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
    class="inline-flex items-center justify-center size-11 rounded-full font-semibold text-white tooltip"
    style="background-color: {{ bgColor() }} "
  >
    {{ initials() }}
    <p class="tooltip-text">{{name()}}</p>
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

    if(this.name().trim().length === 0) return 'N/A';
    
    const byParts = this.name().trim().split(' ');

    if(byParts.length === 1) return byParts[0][0];
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
