#ifndef VERIFICA_VAGA_H_
#define VERIFICA_VAGA_H_
#include "../../tipos.h"

/* Faz uma busca pelo vetor recebido verificando um por um se o sensor
 * referenciado aponta ocupado. Caso não estiver, devolve a vaga em que o sensor
 * está livre, a qual será a melhor vaga. */
int buscar_posicao_da_melhor_vaga(Vaga*,Tag*, int);
Vaga verifica_vaga(Vaga*,Tag*);

#endif  // VERIFICA_VAGA_H_
