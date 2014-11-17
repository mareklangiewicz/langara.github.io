#include "komiwojazer.h"
#include <iostream>
#include <fstream>

int main(int argc, char **argv) {
	if(argc > 2) {
		cerr << "Uzycie: " << argv[0] << " <plik_wej>" << endl;
		cerr << "albo bez parametrow (wtedy program pobierze dane" << endl;
		cerr << "ze standartowego wejscia)." << endl;
		return -1;
	}
	ifstream fin;
	if(argc == 2) {
		fin.open(argv[1]);
		if(!fin) {
			cerr << "Nie mozna otworzyc pliku: " << argv[1] << endl;
			return -1;
		}
	}
	istream &in = (argc == 2) ? fin : cin;
	CGraph g; int v;
	in >> g; // wczytujemy graf
	in >> v; // wczytujemy nr wierzcholka startowego
	g.incCount(v+1);
	ArCVertex path;
	bool ok = Komiwojazer(g.get(v),path,g.getCount(),g);
	if(ok) {
		cout << "Znaleziono droge komiwojazera startujaca w wierzcholku " << v << " :" << endl;
		print(cout,path,g);
	}
	else {
		cout << "nie znaleziono drogi komiwojazera startujacej w wiezcholku " << v << " ." << endl;
	}
	return 0;
}

istream &operator>>(istream &is, CGraph &g) {
	int count = 0;
	int i1 = 0;
	int i2 = 0;
	char dash;
	is >> count; if(!is.good())	{
		wxFAIL;
		return is; // w is jest ustawiony bit mowiacy co sie nie udalo
	}
	for(int i = 0; i < count; i++) {
		is >> i1; if(!is.good()) { wxFAIL; break;	}
		is >> dash;
		if(dash != '-') { is.setstate(ios::failbit); wxFAIL; break;	}
		is >> i2; if(!is.good()) { wxFAIL; break;	}
		AddEdge(g,i1,i2);
	}
	return is;
}

void print(ostream &os,ArCVertex &path,const CGraph &g) {
	for(int i = 0; i < path.GetCount(); i++)
		cout << g.find(path[i]) << " ";
	cout << endl;	
}
void AddEdge(CGraph &g,int i1,int i2) {
	g.incCount(i1+1);
	g.incCount(i2+1);
	g.connect(g.get(i1),g.get(i2));
}

bool Komiwojazer(CVertex *v,ArCVertex &path,int len,const CGraph &g) {
	v->marked = true;
	path.Add(v);
	print(cout,path,g);
	if(path.GetCount() == len) return true;
	for(int i = 0; i < v->tab.GetCount(); i++) {
		if(v->tab[i]->marked) continue;
		bool ok = Komiwojazer(v->tab[i],path,len,g);
		if(ok) return true;
	}
	path.RemoveAt(path.GetCount()-1);
	v->marked = false;
	return false;
}

