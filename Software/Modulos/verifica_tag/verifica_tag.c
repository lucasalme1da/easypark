#include<stdbool.h>
#include "verifica_tag.h"
//#include "../comunicacao/comunicacao.h"

Tag* alocar_vetor_tags(int tamanho){
  Tag* vetor_tag = malloc(tamanho * sizeof(Tag));
  return vetor_tag;
}

void atribuir_vaga(Vaga vaga, Tag* vetor_tags){
  
  //strcpy(vetor_tags[vaga.sensor.id].id_veiculo,placa);
 
 /*  int tamanho_vetor_tags = conta_linha_vagas();
 
  for(int i = 0; i < tamanho_vetor_tags; i++){
    if((vaga.sensor.id - 1) == i){
      vetor_tags recebe a vaga

  } */
  
}

bool confirmar_vaga(char* comando){
  
}

void desaloca_vaga(char* comando){

}