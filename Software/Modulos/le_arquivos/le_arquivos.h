#ifndef LE_ARQUIVOS_H_
#define LE_ARQUIVOS_H_
#include "../../tipos.h"

/* Lê os dados dos arquivos que contém as informações das "vagas" e dos
 "destinos" e popula os vetores recebidos. */
int conta_linhas_destinos();
int conta_linhas_vagas();
Destino* le_destino();
Vaga* le_vagas();

#endif  // LE_ARQUIVOS_H_