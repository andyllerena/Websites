import requests
from bs4 import BeautifulSoup
import os
import csv
import re

from dotenv import load_dotenv

load_dotenv()


#Genius API class to fetch song lyrics and metadata
def request_artist_info(artist_name, page):
    base_url = "https://api.genius.com"
    api_key = os.getenv("GENIUS_API_KEY")
    
    if not api_key:
        raise ValueError("GENIUS_API_KEY environment variable not set. Please set it before running the script.")

    headers = {
        "Authorization": "Bearer " + api_key
    }

    search_url = base_url + "/search"
    params = {
        "q": artist_name,
        'per_page': 10,
        "page": page
    }

    response = requests.get(search_url, headers=headers, params=params)

    if response.status_code != 200:
        print(f"Error: {response.status_code} - {response.text}")
        return None

    return response


#Genius API class to retrieve song lyrics and metadata
def request_song_url(artist_name,song_cap):

    #Intialzize the page number and songs list
    page = 1
    songs = []
    
    #Loop to fetch all songs for the artist
     # Loop to fetch song URLs until the song_cap is reached
    while True:
        # Make a request to the Genius API to get artist information for the given page
        response = request_artist_info(artist_name, page)
        
        # If the response is None (error occurred), exit the loop
        if response is None:
            break
        
        # Parse the response JSON data
        json_data = response.json()

        # Ensure the 'response' and 'hits' keys exist in the JSON data to avoid KeyError
        if 'response' not in json_data or 'hits' not in json_data['response']:
            print("Error: 'response' or 'hits' key not found in the response data")
            break
        
        # List to store song information from the JSON response
        song_info = []

        # Iterate over the 'hits' in the JSON response to filter songs by the artist name
        for hit in json_data['response']['hits']:
            # Check if the artist name in the result matches the requested artist
            if artist_name.lower() in hit['result']['primary_artist']['name'].lower():
                song_info.append(hit)
    
    
        # Collect URLs from the song objects and add them to the songs list until the song_cap is reached
        for song in song_info:
            if len(songs) < song_cap:
                url = song['result']['url']
                songs.append(url)
        
        # If the desired number of song URLs (song_cap) is reached, exit the loop
        if len(songs) == song_cap:
            break
        else:
            # Increment the page number to fetch the next set of results
            page += 1
    
    # Print the number of songs found for the artist
    print('Found {} songs by {}'.format(len(songs), artist_name))

    # Return the list of song URLs
    return songs

#Web Scraping: Extract lyrics from the Genius website
def scrape_song_lyrics(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Look for all divs with class containing 'Lyrics__Container'
    lyrics_divs = soup.find_all('div', class_=lambda value: value and 'Lyrics__Container' in value)

    if not lyrics_divs:
        print(f"Could not find lyrics for {url}")
        return ""

    lyrics = '\n'.join([div.get_text(separator="\n").strip() for div in lyrics_divs])
    lyrics = re.sub(r'[\(\[].*?[\)\]]', '', lyrics)  # Remove [Chorus], (Verse), etc.
    lyrics = os.linesep.join([s for s in lyrics.splitlines() if s])  # Clean empty lines

    return lyrics


#Write_lyrics_to_csv(artist_name,song_count)
def write_lyrics_to_csv(artist_name, song_count):
    # Ensure the 'lyrics' directory exists
    if not os.path.exists('lyrics'):
        os.makedirs('lyrics')

    file_path = 'lyrics/' + artist_name.lower().replace(' ', '_') + '.csv'

    # Step 1: Read already written songs into a set
    existing_songs = set()
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                existing_songs.add(row['Song'].strip())

    # Step 2: Open CSV file for appending
    with open(file_path, 'a', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Song', 'Lyrics']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        # If the file is new, write header
        if not existing_songs:
            writer.writeheader()

        urls = request_song_url(artist_name, song_count)

        for url in urls:
            song_name = url.split('/')[-1].replace('-', ' ').title()
            song_name = song_name.replace(artist_name.title() + ' ', '').replace(' Lyrics', '').strip()

            # Skip if song already in CSV
            if song_name in existing_songs:
                print(f"Skipping already saved song: {song_name}")
                continue

            lyrics = scrape_song_lyrics(url)

            if lyrics:
                print(f"Saving: {song_name}")
                for line in lyrics.splitlines():
                    writer.writerow({'Song': song_name, 'Lyrics': line})

    
    # Print a message indicating success
    print(f'Lyrics written to {file_path}')

if __name__ == '__main__':
    write_lyrics_to_csv('Drake', 50)  # Change 10 to however many songs you want


