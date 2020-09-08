#ifndef CALCULA_VAGA_H_
#define CALCULA_VAGA_H_
#include "../../tipos.h"

/* Calcula as distâncias euclidianas necessárias com base no destino e no vetor
  de vagas e depois retorna a referencia desse mesmo vetor de vagas mas agora
  sorteado. */
void listar_vagas(Vaga*);
void swap(Vaga*, Vaga*);
int partition(Vaga*, int, int);
void quickSort(Vaga*, int, int);
Vaga* calcula_vaga(Destino, Vaga*);

#endif  // CALCULA_VAGA_H_