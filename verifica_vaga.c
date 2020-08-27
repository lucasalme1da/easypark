#include "verifica_vaga.h"

#include <string.h>

#include "le_arquivos.h"

int buscar_posicao_da_melhor_vaga(Vaga* ranking_de_vagas, int numero_de_vagas) {
  for (int i = 0; i < numero_de_vagas; i++) {
    if (ranking_de_vagas[i].sensor.id == 1) {
      return i;
    }
  }
  return -1;
}

Vaga verifica_vaga(Vaga* ranking_de_vagas) {
  Vaga vaga_inexistente;
  int numero_de_vagas = conta_linhas_vagas();
  int posicao_da_melhor_vaga =
      buscar_posicao_da_melhor_vaga(ranking_de_vagas, numero_de_vagas);
  if (posicao_da_melhor_vaga > 0) {
    return ranking_de_vagas[posicao_da_melhor_vaga];
  } else {
    strcpy(vaga_inexistente.nome, "Nao ha vagas");
    return vaga_inexistente;
  }
}