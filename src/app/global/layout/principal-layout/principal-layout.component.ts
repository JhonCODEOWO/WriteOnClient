import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from "../../../utils/notifications/components/container/container.component";

@Component({
  selector: 'app-principal-layout',
  imports: [NavbarComponent, FooterComponent, RouterOutlet, ContainerComponent],
  templateUrl: './principal-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrincipalLayoutComponent implements AfterViewInit{
  ngAfterViewInit(): void {
    // const elements = [(this.footer()?.nativeElement as HTMLElement).clientHeight, (this.header()?.nativeElement as HTMLElement).clientHeight];

  }
}
