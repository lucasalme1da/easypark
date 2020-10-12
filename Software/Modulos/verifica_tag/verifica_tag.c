#include "verifica_tag.h"

#include <stdbool.h>
#include <string.h>

#include "../comunicacao/comunicacao.h"

Tag* alocar_vetor_tags(int tamanho) {
  Tag* vetor_tag = malloc(tamanho * sizeof(Tag));
  return vetor_tag;
}

void atribuir_vaga(char* comando, Vaga vaga, Tag* vetor_tags) {
  // Comando: [fluxo] [placa]

  const char s[2] = " ";
  char* token;

  token = strtok(comando, s);

  while (token != NULL) {
    token = strtok(NULL, ";");
    strcpy(vetor_tags[vaga.sensor.id].id_veiculo, token);
    token = strtok(NULL, s);
  }

  printf("Placa %s na vaga %s\n", vetor_tags[vaga.sensor.id].id_veiculo,
         vaga.nome);
}

bool confirmar_vaga(char* comando, Tag* vetor_tags) {
  // Comando: [fluxo] [sensor_id] [placa]
  // B 12 EDF-8641
  const char s[2] = " ";
  char *token, *placa;
  int i = 0, sensor_id = 0;

  token = strtok(comando, s);

  while (token != NULL) {
    if (i == 0) {
      token = strtok(NULL, s);
      printf("\ntoken -> %s\n", token);
      sensor_id = atoi(token);
      i++;
    } else if (i == 1) {
      token = strtok(NULL, ";");
      printf("\ntoken -> %s\n", token);
      strcpy(placa, token);
      i++;
    } else {
      token = strtok(NULL, s);
    }
  }

  printf("vetor[sensor] -> %s\t placa -> %s\n",
         vetor_tags[sensor_id].id_veiculo, placa);

  if (strcmp(vetor_tags[sensor_id].id_veiculo, placa) != 0) {
    return mandar_comando("0;");
  } else {
    return mandar_comando("1;");
  }
}

void desalocar_vaga(char* comando, Tag* vetor_tags) {
  // Comando: [fluxo] [sensor_id]

  const char s[2] = " ";
  char* token;
  int sensor_id = 0;

  token = strtok(comando, s);

  while (token != NULL) {
    token = strtok(NULL, s);
    sensor_id = atoi(token);
    token = strtok(NULL, ";");
  }

  strcpy(vetor_tags[sensor_id].id_veiculo, "");
}
