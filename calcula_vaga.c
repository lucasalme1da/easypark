#include "calcula_vaga.h"

#include <math.h>
#include <string.h>

void listar_vagas(Vaga* vagas) {
  for (int i = 0; i < 5; i++) {
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

Vaga* calcula_vaga(Destino destino_input, Vaga* vetor_vagas) {
  // Criando dados ficticios para 1 destino e 5 vagas:
  Destino destino;

  strcpy(destino.nome, "destino03");
  destino.ponto.x = 227.0;
  destino.ponto.y = 20.0;
  destino.ponto.z = 6.0;

  Vaga vagas[5];

  strcpy(vagas[0].nome, "a01");
  vagas[0].ponto.x = 15.00;
  vagas[0].ponto.y = 100.00;
  vagas[0].ponto.z = 1.00;
  vagas[0].sensor.id = 1;
  vagas[0].distancia_euclidiana = -1;

  strcpy(vagas[1].nome, "a02");
  vagas[1].ponto.x = 219.00;
  vagas[1].ponto.y = 100.00;
  vagas[1].ponto.z = 1.00;
  vagas[1].sensor.id = 2;
  vagas[1].distancia_euclidiana = -1;

  strcpy(vagas[2].nome, "b01");
  vagas[2].ponto.x = 270.00;
  vagas[2].ponto.y = 100.00;
  vagas[2].ponto.z = 1.00;
  vagas[2].sensor.id = 6;
  vagas[2].distancia_euclidiana = -1;

  strcpy(vagas[3].nome, "c01");
  vagas[3].ponto.x = 15.00;
  vagas[3].ponto.y = 160.00;
  vagas[3].ponto.z = 1.00;
  vagas[3].sensor.id = 11;
  vagas[3].distancia_euclidiana = -1;

  strcpy(vagas[4].nome, "d01");
  vagas[4].ponto.x = 270.00;
  vagas[4].ponto.y = 160.00;
  vagas[4].ponto.z = 1;
  vagas[4].sensor.id = 16;
  vagas[4].distancia_euclidiana = -1;

  // pegar destino 1 como ponto 1
  Ponto p1;
  p1.x = destino.ponto.x;
  p1.y = destino.ponto.y;
  p1.z = destino.ponto.z;

  for (int i = 0; i < 5; i++) {
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
  quickSort(vagas, 0, 4);

  // retornar o array
  // return algumacoisa;

  listar_vagas(vagas);
}
