import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html'
})
export class ThemeToggleComponent implements OnInit {
  darkMode = false;

  ngOnInit() {
    // Leemos el tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      this.darkMode = true;
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      this.darkMode = false;
      document.documentElement.classList.remove('dark');
    } else {
      // Si no hay tema guardado, usamos lo que se tiene definido en preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkMode = prefersDark;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark'); 
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light'); 
    }
  }
}