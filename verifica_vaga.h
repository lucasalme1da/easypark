#ifndef VERIFICA_VAGA_H_
#define VERIFICA_VAGA_H_
#include "tipos.h"

/* Faz uma busca pelo vetor recebido verificando um por um se o sensor
 * referenciado aponta ocupado. Caso não estiver, devolve a vaga em que o sensor
 * está livre, a qual será a melhor vaga. */
Vaga verifica_vaga(Vaga*);

#endif  // VERIFICA_VAGA_H_