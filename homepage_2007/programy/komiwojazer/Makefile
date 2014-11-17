LIBS = `wx-config --libs`
CXXFLAGS = `wx-config --cxxflags`
CC = g++
SOURCES = komiwojazer.cpp Graph.cpp
OBJECTS = komiwojazer.o Graph.o
EXEFILE = komiwojazer
#EXEFILE = komiwojazer.exe

$(EXEFILE): $(OBJECTS)
	$(CC) -o $(EXEFILE) $(OBJECTS) $(LIBS)

%.o: %.cpp
	$(CC) -c $< -o $@ $(CXXFLAGS)

clean:
	rm -fv $(OBJECTS) $(EXEFILE)

nobackup:
	rm -fv *~ *.bak

depend:
	makedepend $(SOURCES)
	
# DO NOT DELETE

komiwojazer.o: komiwojazer.h Graph.h
Graph.o: Graph.h
