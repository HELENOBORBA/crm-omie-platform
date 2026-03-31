/**
 * @file Defines types related to the lead-to-client conversion process.
 */

/**
 * Payload for creating a client in Omie.
 * Based on Omie API documentation for `IncluirCliente`.
 */
export interface OmieCreateClientPayload {
  codigo_cliente_integracao: string; // Unique identifier from our side
  razao_social: string; // Company name or individual's full name
  cnpj_cpf: string; // Brazilian tax identifier
  email: string;
  // Optional fields for more detailed client data
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone1_ddd?: string;
  telefone1_numero?: string;
}

/**
 * Response from Omie after creating a client.
 */
export interface OmieCreateClientResponse {
  codigo_cliente_omie: number; // Omie's internal ID for the client
  codigo_cliente_integracao: string;
  codigo_status: string;
  descricao_status: string;
}
