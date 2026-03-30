/**
 * This file contains TypeScript types related to Omie's client (clientes_cadastro) entities.
 */

/**
 * Represents a client entity in Omie.
 * Based on the `clientes_cadastro` structure from Omie API documentation.
 */
export interface OmieClient {
  codigo_cliente_omie: number;
  codigo_cliente_integracao: string;
  razao_social: string;
  cnpj_cpf: string;
  nome_fantasia: string;
  telefone1_ddd?: string;
  telefone1_numero?: string;
  contato?: string;
  endereco?: string;
  endereco_numero?: string;
  bairro?: string;
  complemento?: string;
  estado?: string;
  cidade?: string;
  cep?: string;
  email?: string;
  homepage?: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  observacao?: string;
}

/**
 * Request parameters for listing clients from Omie API ('ListarClientes').
 */
export interface OmieClientListRequest {
  pagina: number;
  registros_por_pagina: number;
  apenas_importado_api?: 'S' | 'N';
}

/**
 * Response structure from Omie API ('ListarClientes').
 */
export interface OmieClientListResponse {
  pagina: number;
  total_de_paginas: number;
  registros: number;
  total_de_registros: number;
  clientes_cadastro: OmieClient[];
}

/**
 * Response structure from Omie API ('UpsertCliente').
 */
export interface OmieClientUpsertResponse {
  codigo_cliente_omie: number;
  codigo_cliente_integracao: string;
  codigo_status: string;
  descricao_status: string;
}
