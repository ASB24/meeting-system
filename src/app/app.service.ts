import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Participante } from './shared/participante.model';
import { Reunion } from './shared/reunion.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }
  private URL: string = environment.apiURL;

  getReunion(id_reunion: any) {
    return this.http.get<Reunion>(this.URL + `Reunion/${id_reunion}`);
  }



  postPersona(body: Object): Observable<any> {
    return this.http.post<Participante>(this.URL + `Participante`, body);
  }

  getPersonaByDocument(documento: string, tipoDocumento: string): Observable<any> {
    return this.http.get<any>(`${this.URL}Participante/GetUserById/${documento}/${tipoDocumento}`);
  }
}
