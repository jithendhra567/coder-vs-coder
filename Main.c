#include <bits/stdc++.h>
#define ll long long
using namespace std;
ll coins=0, ene=0;
int main()
{
    ll m,n,i,j;
    cin>>m>>n;
    string s;
    vector<string>v(m);
    vector<vector<ll>>v1(m,vector<ll>(n,0));
    for (i=0;i<m;i++){
        cin>>v[i];
    }
    for(i=0;i<m;i++){
        for(j=0;j<n;j++){
            if(i==0){
                if(v[i][j]=='C'){
                    coins++;
                    v1[i][j]=m-i-1;
                }
            }
            else{
                if(v[i][j]=='C'){
                    coins++;
                    ll a=m-i-1;
                    v1[i][j]=min(v1[i-1][j],-a);
                }
                else if(v[i][j]=='H' ){
                    if(v[i-1][j]=='H' ){
                        v1[i][j]=v1[i-1][j];
                    }
                    else{
                        v1[i][j]=m-i;
                    }
                }
                else if(v1[i-1][j]<0){
                    v1[i][j]=v1[i-1][j];
                }
            }
        }
    }
    for(i=0;i<n;i++){
        if(v1[m-1][i]<0){
        ll a=v1[m-1][i];
            ene+=-a;
        }
        else{
            ene+=v1[m-1][i];
        }
    }
    ene=2*ene;
    cout<<coins<<" "<<ene;
    return 0;
}