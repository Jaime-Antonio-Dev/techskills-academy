import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- Vital para el *ngFor
import { CourseService } from './services/course'; 
import { Course } from './models/course.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], // 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  misCursos: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.misCursos = data;
        console.log('Cursos cargados:', this.misCursos);
      },
      error: (err) => console.error('Error al cargar cursos:', err)
    });
  }
}