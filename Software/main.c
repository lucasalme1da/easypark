#include "main.h"

#include "string.h"
int main(void) {
  Destino *destinos = le_destino();

  Vaga *vagas = le_vagas();
  
  Tag *tags = aloca_vetor_tags(conta_linhas_vagas()); 

  while(1){

    char *comando = aguardar_comando(); 
    char fluxo = comando[0];
    if(fluxo == "A"){

      Destino destino = le_input(destinos, conta_linhas_destinos());

      Vaga *ranking_de_vagas = calcula_vaga(destino, vagas);

      Vaga vaga_disponivel = verifica_vaga(ranking_de_vagas);

      atribuir_vaga(vaga_disponivel, tags); 

      exibe_info(vaga_disponivel);

    }
    else if(fluxo == "B"){
      //B a02 carro02
      //confirma_vaga(comando);
    }
    else if(fluxo == "C"){
      //C a02
      //desaloca_vaga(comando);

    }

  }


}