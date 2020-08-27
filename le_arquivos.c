#include "le_arquivos.h"

#include <string.h>

int conta_linhas_destinos() {
  int linhas = 1;
  FILE* arquivo;
  arquivo = fopen("destinos.txt", "r");
  if (arquivo == NULL) {
    printf("Erro ao abrir o arquivo!");
    return 0;
  } else {
    char caractere;
    while ((caractere = fgetc(arquivo)) != EOF) {
      if (caractere == '\n') {
        linhas++;
      }
    }
    fclose(arquivo);
  }
  return linhas;
}

int conta_linhas_vagas() {
  int linhas = 1;
  FILE* arquivo;
  arquivo = fopen("vagas.txt", "r");
  if (arquivo == NULL) {
    printf("Erro ao abrir o arquivo!");
    return 0;
  } else {
    char caractere;
    while ((caractere = fgetc(arquivo)) != EOF) {
      if (caractere == '\n') {
        linhas++;
      }
    }
    fclose(arquivo);
  }
  return linhas;
}

Destino* le_destino() {
  // Chama função para contar número de vagas (número de linhas no arquivo)
  int linhas = conta_linhas_destinos();
  // Leitura do arquivo de entrada
  FILE* arquivo;
  arquivo = fopen("destinos.txt", "r");
  if (arquivo == NULL) {
    printf("Erro ao abrir o arquivo!");
    return 0;
  } else {
    // Alocação dinâmica de um array de structs
    Destino* vetor_destinos = malloc(linhas * sizeof(Destino));
    Destino destino;
    int i = 0;
    while (fscanf(arquivo, "%s%*c %f%*c %f%*c %f%*c", destino.nome,
                  &destino.ponto.x, &destino.ponto.y,
                  &destino.ponto.z) != EOF) {
      vetor_destinos[i++] = destino;
    }

    return vetor_destinos;
  }
  fclose(arquivo);
}

Vaga* le_vagas() {
  // Chama função para contar número de vagas (número de linhas no arquivo)
  int linhas = conta_linhas_vagas();
  // Leitura do arquivo de entrada
  FILE* arquivo;
  arquivo = fopen("vagas.txt", "r");
  if (arquivo == NULL) {
    printf("Erro ao abrir o arquivo!");
    return 0;
  } else {
    // Alocação dinâmica de um array de structs
    Vaga* vetor_vagas = malloc(linhas * sizeof(Vaga));
    Vaga vaga;
    int i = 0;
    while (fscanf(arquivo, "%s%*c %f%*c %f%*c %f%*c %d%*c %f%*c", vaga.nome,
                  &vaga.ponto.x, &vaga.ponto.y, &vaga.ponto.z, &vaga.sensor.id,
                  &vaga.distancia_euclidiana) != EOF) {
      vetor_vagas[i++] = vaga;
    }

    /* for (int i = 0; i < linhas; i++) {
      printf("\n%s\n", vetor_vagas[i].nome);
      printf("%f\n", vetor_vagas[i].ponto.x);
      printf("%f\n", vetor_vagas[i].ponto.y);
      printf("%f\n", vetor_vagas[i].ponto.z);
      printf("%d\n", vetor_vagas[i].sensor.id);
      printf("%f\n", vetor_vagas[i].distancia_euclidiana);
    } */
    return vetor_vagas;
  }
  fclose(arquivo);
}
