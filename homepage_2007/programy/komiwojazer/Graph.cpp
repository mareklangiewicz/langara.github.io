#include "Graph.h"

void CVertex::isolate() {
	size_t count = tab.GetCount();
	for(int i = 0; i < count; i++)
		tab[i]->tab.Remove(this);
}
