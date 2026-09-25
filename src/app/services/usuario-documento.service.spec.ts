import { TestBed } from '@angular/core/testing';

import { UsuarioDocumentoService } from './usuario-documento.service';

describe('UsuarioDocumentoService', () => {
  let service: UsuarioDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioDocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
