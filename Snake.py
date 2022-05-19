N = int(input())
M = int(input())
memorize = {}
for i in range(M):
    e1, e2 = map(int, input().split())
    memorize[e1] = memorize.get(e1, 0) + 1
    memorize[e2] = memorize.get(e2, 0) + 1
WTWT = sorted(list(map(int, input().split())))[::-1]
DLDL = sorted([v for v in memorize.values()])[::-1]
SUM = 0
for i, j in zip(WTWT, DLDL):
    SUM += i * j
print(SUM , end='')
