#include "calcula_vaga.h"

#include <math.h>
#include <string.h>

#include "le_arquivos.h"

void listar_vagas(Vaga* vagas) {
  int numero_de_vagas = conta_linhas_vagas();
  for (int i = 0; i < numero_de_vagas; i++) {
    printf("\n%s\n", vagas[i].nome);
    printf("%f\n", vagas[i].ponto.x);
    printf("%f\n", vagas[i].ponto.y);
    printf("%f\n", vagas[i].ponto.z);
    printf("%d\n", vagas[i].sensor.id);
    printf("%f\n", vagas[i].distancia_euclidiana);
  }
}

void swap(Vaga* a, Vaga* b) {
  Vaga t = *a;
  *a = *b;
  *b = t;
}

int partition(Vaga arr[], int low, int high) {
  float pivot = arr[high].distancia_euclidiana;
  int i = (low - 1);

  for (int j = low; j <= high - 1; j++) {
    if (arr[j].distancia_euclidiana < pivot) {
      i++;
      swap(&arr[i], &arr[j]);
    }
  }
  swap(&arr[i + 1], &arr[high]);
  return (i + 1);
}

void quickSort(Vaga arr[], int low, int high) {
  if (low < high) {
    int pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

Vaga* calcula_vaga(Destino destino, Vaga* vagas) {
  // conta o numero de vagas do estacionamento
  int numero_de_vagas = conta_linhas_vagas();

  // pega destino informado como ponto 1
  Ponto p1;
  p1.x = destino.ponto.x;
  p1.y = destino.ponto.y;
  p1.z = destino.ponto.z;

  for (int i = 0; i < numero_de_vagas; i++) {
    // pegar vaga por vaga como ponto 2
    Ponto p2;
    p2.x = vagas[i].ponto.x;
    p2.y = vagas[i].ponto.y;
    p2.z = vagas[i].ponto.z;

    // fazer o calculo da distancia euclidiana entre x1,y1,z1 e x2,y2,z2
    float distanciaEuclidianaCalculada =
        sqrt(pow(p2.x - p1.x, 2) + pow(p2.y - p1.y, 2) + pow(p2.z - p1.z, 2));

    // guardar o resultado na vaga.distancia_euclidiana
    vagas[i].distancia_euclidiana = distanciaEuclidianaCalculada;
  }

  // sortear esse array usando quicksort
  quickSort(vagas, 0, numero_de_vagas - 1);

  return vagas;
}
