all: compila_tudo rodar

teste: 
	gcc -o main main.c calcula_vaga.c le_arquivos.c
compila_tudo_com_tipos:
	gcc -o main *.c -include tipos.h 
compila_tudo:
	gcc -o main *.c Modulos/le_arquivos/le_arquivos.c Modulos/exibe_info/exibe_info.c Modulos/verifica_vaga/verifica_vaga.c Modulos/verifica_tag/verifica_tag.c Modulos/le_input/le_input.c Modulos/comunicacao/comunicacao.c Modulos/calcula_vaga/calcula_vaga.c 
rodar:
	./main