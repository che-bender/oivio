import os

def chg():
    lines = open('world.txt','r').readlines()
    out = open('w-new.txt','w')
    for line in lines:
        line = line[:-1]
        newline = ''
        for ch in line:
            if ch == ' ':
                ch = 'a'
            else:
                ch = ' '
            newline = newline + ch
        out.write(newline+'\n')
    out.close()

chg()
