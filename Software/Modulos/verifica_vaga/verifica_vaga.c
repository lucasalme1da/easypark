#include "verifica_vaga.h"

#include <string.h>

#include "../comunicacao/comunicacao.h"
#include "../le_arquivos/le_arquivos.h"

int buscar_posicao_da_melhor_vaga(Vaga* ranking_de_vagas, int numero_de_vagas) {
  char* string_estado_dos_sensores = mandar_comando("sensores;");
  char caractere = ' ';
  int indice_string = 0, tamanho_do_vetor = 0;

  while (caractere != ';') {
    caractere = string_estado_dos_sensores[indice_string++];
    if (caractere != ' ') {
      tamanho_do_vetor++;
    }
  }

  int* vetor_estado_dos_sensores = malloc(tamanho_do_vetor * sizeof(int));

  caractere = ' ';
  indice_string = 0;
  int indice_vetor = 0;
  while (caractere != ';') {
    caractere = string_estado_dos_sensores[indice_string++];
    if (caractere != ' ') {
      vetor_estado_dos_sensores[indice_vetor++] = atoi(&caractere);
    }
  }

  for (int i = 0; i < numero_de_vagas; i++) {
    if (vetor_estado_dos_sensores[ranking_de_vagas[i].sensor.id] == 1) {
      free(vetor_estado_dos_sensores);
      return i;
    }
  }

  free(vetor_estado_dos_sensores);
  return -1;
}

Vaga verifica_vaga(Vaga* ranking_de_vagas) {
  Vaga vaga_inexistente;
  int numero_de_vagas = conta_linhas_vagas();
  int posicao_da_melhor_vaga =
      buscar_posicao_da_melhor_vaga(ranking_de_vagas, numero_de_vagas);
  if (posicao_da_melhor_vaga >= 0) {
    return ranking_de_vagas[posicao_da_melhor_vaga];
  } else {
    strcpy(vaga_inexistente.nome, "Nao ha vagas");
    return vaga_inexistente;
  }
}
