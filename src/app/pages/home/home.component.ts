import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PublicService } from '../../services/public.service';
import { SpaView } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  spas: SpaView[] = [];
  searchTerm: string = '';
  loading = false;

  constructor(private publicService: PublicService) {}

  ngOnInit() {
    this.loadSpas();
  }

  loadSpas() {
    this.loading = true;
    this.publicService.getAllSpas().subscribe({
      next: (spas) => {
        this.spas = spas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading spas:', error);
        this.loading = false;
      }
    });
  }

  searchSpas() {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.publicService.searchSpas(this.searchTerm).subscribe({
        next: (spas) => {
          this.spas = spas;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching spas:', error);
          this.loading = false;
        }
      });
    } else {
      this.loadSpas();
    }
  }
}
