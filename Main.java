import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int currentIndex = 0;
        int boardSize = 10;
        boolean left = true;
        String[] array = new String[boardSize * boardSize];
        String[][] matrix = new String[boardSize][boardSize];
        for (int i = 0; i <  boardSize; i++) {
            for (int j = 0; j < boardSize; j++) {
                matrix[i][j] = sc.next();
            }
        }
        for(int i = boardSize-1; i >= 0; i--) {
            if(left)
                for(int j = 0; j < boardSize; j++) {
                    String input = matrix[i][j];
                    if(input.equals("Start")) input = "1";
                    else if(input.equals("End")) input = "100";
                    else if(input.charAt(0) == 'S' || input.charAt(0) == 'L') input = input.substring(2, input.length()-1);
                    if(input.equals("Start")) input = "1";
                    else if(input.equals("End")) input = "100";
                    array[currentIndex++] = input;
                }
            else{
                String[] temp = new String[boardSize];
                for(int j = 0; j < boardSize; j++) temp[j] = matrix[i][j];
                for(int j = boardSize-1; j >= 0; j--) {
                    String input = temp[j];
                    if(input.equals("Start")) input = "1";
                    else if(input.equals("End")) input = "100";
                    else if(input.charAt(0) == 'S' || input.charAt(0) == 'L') input = input.substring(2, input.length()-1);
                    if(input.equals("Start")) input = "1";
                    else if(input.equals("End")) input = "100";
                    array[currentIndex++] = input;
                }
            }
            left = !left;
        }
        currentIndex = 0;
        int s=0, l=0;
        sc.nextLine();
        String[] inputs = sc.nextLine().split(" ");
        for(int i = 0; i < inputs.length; i++) {
            //convert input to int
            int input = Integer.parseInt(inputs[i]);
            try{
                int prev = currentIndex;
                currentIndex = Integer.parseInt(array[currentIndex+input-1]);
                if(prev>currentIndex) s++;
                else if(prev+input<currentIndex) l++;
            }
            catch(Exception e) {
                
            }
        }
        if(currentIndex==100) System.out.println("Possible "+s+" "+l);
        else System.out.println("Not possible "+s+" "+l+" "+((currentIndex==1)?"Start":""+currentIndex));
    }
}