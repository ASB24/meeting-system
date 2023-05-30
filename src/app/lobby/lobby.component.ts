import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppService } from '../app.service';
import { Reunion } from '../shared/reunion.model';
@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  lobby: boolean = true;
  constructor() {
  }

  ngOnInit(): void {
  }
}
