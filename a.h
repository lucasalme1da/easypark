#include <stdio.h>
#include <stdlib.h>

typedef struct {
  int id;
} Sensor;

typedef struct {
  float x;
  float y;
  float z;
} Ponto;

typedef struct {
  char nome[10];
  Ponto ponto;
  Sensor sensor;
  float distancia_euclidiana;
} Vaga;

typedef struct {
  char nome[10];
  Ponto ponto;
} Destino;
