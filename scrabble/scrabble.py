import random


ENGLISH_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

def open_dictionary(file):
    with open(file) as f:
        lines = f.readlines()
        
    return lines

def letter_points(word):
    #This function puts letters into a dictionary and assigns them values
    #using the chars we are able to match them to points and create a sum total for the word
    # 
     
    letter_dict = dict.fromkeys(['E', 'A', 'I', 'O', 'N', 'R', 'T', 'L', 'S', 'U'], 1)
    letter_dict.update(dict.fromkeys(['D', 'G'], 2 ))
    letter_dict.update(dict.fromkeys(['B', 'C', 'M', 'P'], 3))
    letter_dict.update(dict.fromkeys(['F', 'H', 'V', 'W', 'Y' ], 4))
    letter_dict.update(dict.fromkeys(['K'], 5))
    letter_dict.update(dict.fromkeys(['J', 'X'], 8))
    letter_dict.update(dict.fromkeys(['Q', 'Z'], 10))

    points = 0
    for i in word:
        points += letter_dict[i.upper()]

    return(points)

def bag():
    #This function puts letters into a dictionary and assigns them values based on number of tiles
    #using the chars we are able to match them to points and create a sum total for the word
    # 
    tile_dict = dict.fromkeys(['E'], 12)
    tile_dict.update(dict.fromkeys(['A', 'I'], 9 ))
    tile_dict.update(dict.fromkeys(['O'], 8))
    tile_dict.update(dict.fromkeys(['N', 'R', 'T'], 6))
    tile_dict.update(dict.fromkeys(['L', 'S', 'U', 'D'], 4))
    tile_dict.update(dict.fromkeys(['G' ], 3))
    tile_dict.update(dict.fromkeys(['B','C', 'M', 'P', 'F', 'H', 'V', 'W', 'Y'], 2))
    tile_dict.update(dict.fromkeys(['K', 'J', 'X', 'Q', 'Z'], 1))

    return(tile_dict)

def players_rack(bag_select):
    
    player_arr = []

    for i in range(1, 8, 1):
        x = ENGLISH_ALPHABET[random.randint(0,25)]
        if(bag_select[x] == 0):
            x = ENGLISH_ALPHABET[random.randint(0,25)]
        else:
            player_arr.append(x)
            bag_select[x] -= 1

    return(player_arr)

def main():
    test_word = 'guardian'
    print(letter_points(test_word))
    bag_tiles = bag()
    player_1 = players_rack(bag_tiles)
    print(player_1)

    words = []

    word_dictionary = open_dictionary('dictionary.txt')
    for i in word_dictionary:
        i = i.strip(str('\n'))
        words.append(i.upper())

    

    ##print(words)


main()