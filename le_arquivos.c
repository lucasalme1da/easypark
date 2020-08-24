#include "le_arquivos.h"
#include <string.h>

Destino* le_destino(){
  
  //Leitura do arquivo de entrada
  FILE* arquivo;
  
  int linhas = 1;
  char caractere;
  
  arquivo = fopen("destinos.txt", "r");
  //Contagem de linhas do arquivo
  if(arquivo == NULL){
    printf("Erro ao abrir o arquivo!");
    return 0;
  }else{
    while((caractere=fgetc(arquivo)) != EOF){
      if(caractere == '\n'){
        linhas++;
      }
    }
    rewind(arquivo);
    //Alocação dinâmica de um array de structs
    Destino * vetor_destinos = malloc(linhas * sizeof(Destino));
    Destino destino;
    int i = 0;
    while(fscanf(arquivo, "%s%*c %f%*c %f%*c %f%*c", destino.nome, &destino.ponto.x, &destino.ponto.y, &destino.ponto.z) != EOF){
      vetor_destinos[i++] = destino;
    }

    /* for (int i = 0; i < linhas; i++) {
      printf("\n%s\n", vetor_destinos[i].nome);
      printf("%.2f\n", vetor_destinos[i].ponto.x);
      printf("%.2f\n", vetor_destinos[i].ponto.y);
      printf("%.2f\n", vetor_destinos[i].ponto.z);
    } */
    return vetor_destinos;
  } 
  fclose(arquivo);
}


Vaga* le_vagas(){
  
  //Leitura do arquivo de entrada
  FILE* arquivo;
  
  int linhas = 1;
  char caractere;
  
  arquivo = fopen("vagas.txt", "r");
  
  //Contagem de linhas do arquivo
  if(arquivo == NULL){
    printf("Erro ao abrir o arquivo!");
    return 0;
  }else{
    while((caractere=fgetc(arquivo)) != EOF){
      if(caractere == '\n'){
        linhas++;
      }
    }
    rewind(arquivo);
    //Alocação dinâmica de um array de structs
    Vaga* vetor_vagas = malloc(linhas * sizeof(Vaga));
    Vaga vaga;
    int i = 0;
    while(fscanf(arquivo, "%s%*c %f%*c %f%*c %f%*c %d%*c %f%*c", vaga.nome, &vaga.ponto.x, &vaga.ponto.y, &vaga.ponto.z, &vaga.sensor.id, &vaga.distancia_euclidiana) != EOF){
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

