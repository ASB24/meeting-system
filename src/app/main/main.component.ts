
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router'
import { Participante } from '../shared/participante.model';
import { Reunion } from '../shared/reunion.model';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  //Variable para habilitar parte de usuarios externos
  devVariable = false;
  loading: boolean = false;

  myForm: FormGroup;
  inputChange: boolean = false;
  disable: boolean = false;
  btnActive = true;
  id_Reunion = 0;
  errorReunion = false;
  gracias = false;
  inicio = true;
  selection = false;
  formulario = false;
  empleado = false;
  found = true;
  documentos = false;
  cedula = false;
  state = false;
  formularioExterno = false;
  enable = true;

  persona: Participante = {
    reunionId: 0,
    nombres: "string",
    cargo: "string",
    sexo: "string",
    tipoDocumento: "string",
    documento: "string",
    institucion: "string",
    telefono: "string",
    correoElectronico: "string",
    estatus: true
  }
  reunion: Reunion = {
    data: {
      id: 0,
      tema: "",
      area: "",
      fecha: "",
      desde: "",
      hasta: "",
      lugar: "",
      nota: ""
    }
  }

  constructor(private location: Location, private router: Router, private app: AppService, private fb: FormBuilder, private activatedRoute: ActivatedRoute) {
    this.myForm = this.fb.group({
      nombres: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      institucion: ['', [Validators.required]],
      email: ['', [Validators.required,
      Validators.email]],
      telefono: ['', [Validators.required,
      Validators.pattern('\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b')]],
      sexo: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      tipoDocumento: ['', Validators.required]
    })
  }

  //Ready
  ngOnInit() {
    this.loading = true;
    this.activatedRoute.params.subscribe(params => {
      this.id_Reunion = params['id'];
      this.persona.reunionId = params['id']
      this.app.getReunion(this.id_Reunion).subscribe(data => {
        this.reunion.data.id = data.data.id;
        this.reunion.data.area = data.data.lugar;
        this.reunion.data.tema = data.data.tema;
        this.reunion.data.fecha = data.data.fecha.slice(0, 10);
        this.reunion.data.hasta = data.data.hasta.slice(11, 16);
        this.reunion.data.desde = data.data.desde.slice(11, 16);
        this.found = true;
        this.loading = false;
      }, error => {
        this.errorReunion = true;
        this.inicio = false;
        this.loading = false;
      })
    })
  }

  searchParticipante() {
    let tempDocumento = this.myForm.value.documento;
    let tempTipoDocumento = this.myForm.value.tipoDocumento;
    this.loading = true;
    this.app.getPersonaByDocument(tempDocumento, tempTipoDocumento).subscribe((data) => {
      const { nombreCompleto, cargo, correoElectronico, institucion, sexo, telefono } = data.data;
      this.myForm.patchValue({ nombres: nombreCompleto, sexo: sexo !== null ? sexo : "", telefono: telefono, institucion: institucion, cargo: cargo, email: correoElectronico });
      this.loading = false;
      this.disable = true;
    }, error => {
      this.disable = false;
      this.loading = false;
      this.myForm.reset();
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo encontrar ningun registro, porfavor ingrese sus datos',
        icon: 'error',
        confirmButtonText: 'Ok'
      })
    })
  }

  //! Method to open the form

  lobbyButton(): void {
    this.inicio = false;
    this.formulario = true;
  }

  changeInput(e: any) {
    let temp = this.myForm.value.tipoDocumento;
    temp === 'c' ? this.inputChange = true : this.inputChange = false;
  }

  getValues() {
    this.loading = true;
    let tempPerson: Object = {
      nombreCompleto: this.myForm.getRawValue().nombres,
      cargo: this.myForm.value.cargo,
      institucion: this.myForm.value.institucion,
      sexo: this.myForm.value.sexo,
      documento: this.myForm.getRawValue().documento,
      telefono: this.myForm.value.telefono,
      correoElectronico: this.myForm.value.email,
      tipoDocumento: this.myForm.getRawValue().tipoDocumento,
      estatus: true,
      reunionId: this.persona.reunionId
    }

    this.app.postPersona(tempPerson).subscribe(data => {
      Swal.fire({
        title: 'Gracias!',
        text: `Usted ha sido registrado en la reunión`,
        icon: 'success',
        confirmButtonText: 'Entendido'
      })
      this.formulario = false;
      this.location.replaceState('/finished');
      this.gracias = true;
      this.loading = false;
    }, error => {
      this.loading = false;
      if (error.status == 400) {
        Swal.fire({
          title: 'Error!',
          text: 'Usted no ha podido ser registrado, intentelo nuevamente',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
        this.myForm.reset();
        this.disable = false;
      }
      else if (error.status == 409) {
        Swal.fire({
          title: 'Error!',
          text: 'Ya usted se encuentra registrado',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
        this.myForm.reset();
        this.formulario = false;
        this.gracias = true;
        this.location.replaceState('/finished');
      }
      else {
        this.myForm.reset();
        this.disable = false;
        Swal.fire({
          title: 'Error!',
          text: 'Hubo un error, intentelo nuevamente',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      }
    })
  }


  get nombres() {
    return this.myForm.get('nombres');
  }
  get cargo() {
    return this.myForm.get('cargo');
  }
  get institucion() {
    return this.myForm.get('institucion');
  }
  get email() {
    return this.myForm.get('email');
  }
  get telefono() {
    return this.myForm.get('telefono');
  }
  get sexo() {
    return this.myForm.get('sexo');
  }

  get documento() {
    return this.myForm.get('documento');
  }

  get tipoDocumento() {
    return this.myForm.get('tipoDocumento');
  }
}
