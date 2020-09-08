#include "main.h"

#include "string.h"
int main(void) {
  Destino *destinos = le_destino();

  Vaga *vagas = le_vagas();

  Destino destino = le_input(destinos, conta_linhas_destinos());

  Vaga *ranking_de_vagas = calcula_vaga(destino, vagas);

  Vaga vaga_disponivel = verifica_vaga(ranking_de_vagas);

  exibe_info(vaga_disponivel);
}