import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import {Task} from './../../models/task.model';
import { pipe } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export enum Filtrado {
  ALL = 'all',
  PENDIENTE = 'pending',
  COMPLETED = 'completed'
}

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule], /* JsonPipe */
  templateUrl: './home.component.html',
  styleUrl: './home.component.css', 
})

export  class HomeComponent {
  completed= '';

  Filtrado = Filtrado;

  filter = signal<Filtrado> (Filtrado.ALL);
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();    
    console.log(filter.toString());
    if (filter.toString() === Filtrado.PENDIENTE) {
      return tasks.filter(task => !task.completed);      
    }
    if (filter === Filtrado.COMPLETED) {
      return tasks.filter(task => task.completed);
    }
    return tasks;
  });


  tasks = signal<Task[]>([
   /*  {
      id: Date.now(),
      title: 'Crear proyecto',
      completed: false,
    },
    {
      id: Date.now(),
      title: 'Crear componente',
      completed: false,
    },
    {
      id: Date.now(),
      title: 'Crear proyecto',
      completed: false,
    } */
  ]);

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,       
      Validators.pattern(/^\S.+\S$/),
    ]
  });

  editTaskCtrl= new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,       
      Validators.pattern(/^\S.+\S$/),
    ]
  });

injector = inject(Injector)

  ngOnInit(){
    const Storage = localStorage.getItem('tasks');
    if (Storage){
      this.tasks.set(JSON.parse(Storage));
    }
    this.tracjTasks();
  }

  tracjTasks(){
    effect(() => {
      console.log('Tareas modificadas');
      const tasks = this.tasks();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, {injector: this.injector});
  }

  colorCtrl = new FormControl('red');

  changeHandler(){
    if (this.newTaskCtrl.valid){
      const value = this.newTaskCtrl.value;
      this.addTask(value);
      this.newTaskCtrl.setValue('');
    }else{
      console.log('No se puede agregar la tarea');
    }
  }

  addTask(title: string){
    const newTask= {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number){
    this.tasks.update((tasks)=> tasks.filter((tasks, position)=> position !== index));
  }

  updateTask(index: number){
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    } )
  }

  updateTaskEditingMode(index: number){
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: true
          }
        }
        return {
          ...task,
          editing: false
        }
      })
    } )
  }

  updateTaskText(index: number){
    if (this.editTaskCtrl.valid){
      const value = this.editTaskCtrl.value;
      this.tasks.update((tasks) => {
        return tasks.map((task, position) => {
          if (position === index) {
            return {
              ...task,
              title: value,
              editing: false
            }
          }
          return {
            ...task,
            editing: false
          }
        })
      } )
    }else{
      console.log('No se puede agregar la tarea');
    }    
  }

  changeFilter(Filtrados: Filtrado){
    this.filter.set(Filtrados);
  }


}

