import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { UserService } from './user.service';
import { environment } from '../../../../environments/environments';
import { IUser } from '../models/user.model';
import { EPhoneType } from '../models/phone-type.enum';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const api = `${environment.apiUrl}/users`;

  const user: IUser = {
    id: 1,
    name: 'Fulano',
    email: 'fulano@teste.com',
    cpf: '52998224725',
    phone: '11987654321',
    typePhone: EPhoneType.Mobile,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar usuários sem filtro de busca', () => {
    service.getUsers().subscribe((result) => {
      expect(result).toEqual([user]);
    });

    const req = httpMock.expectOne((request) => request.url === api);

    expect(req.request.method).toBe('GET');
    expect(req.request.params.has('name_like')).toBe(false);

    req.flush([user]);
  });

  it('deve buscar usuários aplicando filtro de busca por nome', () => {
    service.getUsers('Fulano').subscribe((result) => {
      expect(result).toEqual([user]);
    });

    const req = httpMock.expectOne(
      (request) => request.url === api && request.params.get('name_like') === 'Fulano'
    );

    expect(req.request.method).toBe('GET');

    req.flush([user]);
  });

  it('deve tratar erro ao buscar usuários', () => {
    service.getUsers().subscribe({
      next: () => fail('não deveria emitir sucesso'),
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(api);
    req.flush('erro', { status: 500, statusText: 'Server Error' });
  });

  it('deve cadastrar um novo usuário', () => {
    const { id, ...request } = user;

    service.createUser(request).subscribe((result) => {
      expect(result).toEqual(user);
    });

    const req = httpMock.expectOne(api);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush(user);
  });

  it('deve tratar erro ao cadastrar um novo usuário', () => {
    const { id, ...request } = user;

    service.createUser(request).subscribe({
      next: () => fail('não deveria emitir sucesso'),
      error: (error) => {
        expect(error.status).toBe(400);
      },
    });

    const req = httpMock.expectOne(api);
    req.flush('erro', { status: 400, statusText: 'Bad Request' });
  });

  it('deve atualizar um usuário existente', () => {
    const request = { name: 'Novo nome' };

    service.updateUser(user.id, request).subscribe((result) => {
      expect(result).toEqual(user);
    });

    const req = httpMock.expectOne(`${api}/${user.id}`);

    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(request);

    req.flush(user);
  });

  it('deve tratar erro ao atualizar um usuário', () => {
    const request = { name: 'Novo nome' };

    service.updateUser(user.id, request).subscribe({
      next: () => fail('não deveria emitir sucesso'),
      error: (error) => {
        expect(error.status).toBe(404);
      },
    });

    const req = httpMock.expectOne(`${api}/${user.id}`);
    req.flush('erro', { status: 404, statusText: 'Not Found' });
  });
});
