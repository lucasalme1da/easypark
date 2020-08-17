all: compila_tudo rodar

teste: 
	gcc -o main main.c calcula_vaga.c le_arquivos.c
compila_tudo_com_tipos:
	gcc -o main *.c -include tipos.h
compila_tudo:
	gcc -o main *.c 
rodar:
	./main