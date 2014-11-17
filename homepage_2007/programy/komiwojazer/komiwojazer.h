#ifndef _KOMIWOJAZER_H_
#define _KOMIWOJAZER_H_

#include "Graph.h"
#include <iosfwd>
using namespace std;

istream &operator>>(istream &is, CGraph &g); // wczytuje ze strumienia
	// liczbe krawedzi i krawedzie i dodaje je do grafu (i odpowiednie wierzcholki tez)
	// krawedz czytamy jako dwie liczby oddzielone myslnikiem (numery wierzcholkow)

void AddEdge(CGraph &g,int i1,int i2); // dodaje krawedz z vertexa nr i1 do vertexa nr i2
	// jesli graf nie ma jeszcze vertexa nr i1 lub i2, to zostaje powiekszony tak zeby mial.

bool Komiwojazer(CVertex *v,ArCVertex &path,int len,const CGraph &g);
	// sciezke w grafie o dlugosci len zaczynajaca sie od vertexa v.
	// przed wykonaniem vertexy powinny miec wyzerowane pole marked
	// (chyba ze chcemy ominac niektore to im ustawiamy marked)
	// jak nie znajdzie takiej dlugiej sciezki to zwraca false
	// standartowo len ustawiamy na ilosc wierzcholkow grafu - 1.

void print(ostream &os,ArCVertex &path,const CGraph &g);

#endif // #ifndef _KOMIWOJAZER_H_
