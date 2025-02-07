import { Component, signal } from '@angular/core';
import {persons} from './../../models/person.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-labs',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})



export class LabsComponent {

  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50, {
    nonNullable: true,
  });
  nameCtrl = new FormControl(50, {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3),
    ]
  });

  show = true;
  
  constructor(){
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  isVisible = true;

  mensaje_pers = 'Este mensaje viene desde la logica app.component';
  tasks = [
    'Instalar el angular CLI', 'Crear componente', 'Crear proyecto'
  ];
  
  disabled='disabled';

  person = signal(
    {
    name: 'Henry',
    apellido: 'Alcaraz',
    age: 17,
    avatar: 'https://w3schools.com/howto/img_avatar.png'
    }
  );  

  clickhandler(){
    alert('Hola')
  }

  changeHandler(event: Event){
    const input = event.target as HTMLInputElement;
    console.log(event);
    this.person().age = parseInt(input.value, 10);
  }

  changeAge(event: Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => ({...prevState, age: parseInt(newValue, 10)}))
  }

  keydownHandler(event: KeyboardEvent){
    const input = event.target as HTMLInputElement;
    this.person().name = input.value;
    console.log(input.value);
  }
}
