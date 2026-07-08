import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environments";
import { Observable } from "rxjs";
import { IUser } from "../models/user.model";
import { ICreateUserRequest } from "../models/create-user.request";
import { IUpdateUserRequest } from "../models/update-user.request";
/**
 * Serviço responsável pela comunicação com a API de usuários.
 * 
 * Disponibiliza operações para listar, cadastrar e atualizar usuários.
 *
 * @export
 * @class UserService
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  /**
   * Cliente HTTP utilizado para realizar as requisições à API.
   *
   * @private
   * @memberof UserService
   */
  private readonly http = inject(HttpClient);

  /**
   * Endpoint base da API de usuários.
   *
   * @private
   * @memberof UserService
   */
  private readonly api = `${environment.apiUrl}/users`;

  /**
   * Obtém a lista de usuários.
   * 
   * Permite filtar por nome.
   *
   * @param {string} [search]
   * @return {*}  {Observable<IUser[]>}
   * @memberof UserService
   */
  public getUsers(search?: string): Observable<IUser[]> {
    const params = search ? new HttpParams().set('nome_like', search) : undefined;

    return this.http.get<IUser[]>(this.api, { params });
  }

  /**
   * Cadastra um novo usuário.
   *
   * @param {ICreateUserRequest} request
   * @return {*}  {Observable<IUser>}
   * @memberof UserService
   */
  public createUser(request: ICreateUserRequest): Observable<IUser> {
    return this.http.post<IUser>(this.api, request);
  }

  /**
   * Atualiza parcialmente os dados de um usuário
   *
   * @param {number} id
   * @param {IUpdateUserRequest} request
   * @return {*}  {Observable<IUser>}
   * @memberof UserService
   */
  public updateUser(id: number, request: IUpdateUserRequest): Observable<IUser> {
    return this.http.patch<IUser>(`${this.api}/${id}`, request);
  }
}