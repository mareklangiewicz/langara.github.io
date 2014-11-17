#ifndef _GRAPH_H_
#define _GRAPH_H_

#include "wx/wxprec.h"

#ifdef __BORLANDC__
    #pragma hdrstop
#endif

#ifndef WX_PRECOMP
    #include "wx/wx.h"
#endif

class CVertex;

WX_DEFINE_ARRAY(CVertex*,ArCVertex);

class CVertex {
	public:
		bool marked; // do dowolnego uzytku
		ArCVertex tab; // tablica sasiadow
		void isolate(); // mowi wszystkim sasiadom zeby o nim zapomnieli (warto to wykonac przed samobojstwem)
		CVertex() { marked = false; }
		virtual ~CVertex () { isolate(); }
};

/*
 * UWAGA: nie deletowac vertexow recznie bo Graph je zdeletuje i tak jeszcze raz!
 */
class CGraph {
	private:
		ArCVertex vertices;
	public:
		CVertex *get(int idx) const { return vertices[idx]; } // zwraca vertexa o podanym numerze
		void add(CVertex *v) { vertices.Add(v); } // vertex zostaje przejety na wlasnosc (Graph go na koncu zdeletuje)
		CVertex *addNew() { CVertex *v = new CVertex(); add(v); return v; } // dodaje nowego samotnego wierzcholka
		void del(int idx) { delete vertices[idx]; vertices.RemoveAt(idx); } // kosi vertexa o podanym numerze
		int find(CVertex *v) const { return vertices.Index(v); } // zwraca index w tablicy. jak niema to wxNOT_FOUND
		int getCount() const { return vertices.GetCount(); }
		void incCount(int count) { while(getCount() < count) addNew(); } // upewnia sie ze graf ma CONAJMNIEJ count vertexow
		void decCount(int count) { while(getCount() > count) del(count); } // upewnia sie ze graf ma CONAJWYZEJ count vertexow
		void setCount(int count) { incCount(count); decCount(count); }
		void connect(CVertex *v1,CVertex *v2) { v1->tab.Add(v2); v2->tab.Add(v1); } // czyli laczy vertexy krawedzia
		virtual ~CGraph() { decCount(0); }
};

#endif // #ifndef _GRAPH_H_
