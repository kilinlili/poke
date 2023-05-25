import './App.css'
import Navbar from './components/Navbar/Navbar';
import Card from './components/Card/Card';
import { getAllPokemon, getPokemon } from './utils/pokemon'
import { useEffect, useState } from 'react'

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true)
  const [pokemonData, setPokemonData] = useState([])
  const [nextURL, setNextURL] = useState("")//次のページのURLを格納する
  const [prevURL, setPrevURL] = useState("")

  useEffect(() => {
    const fetchPokemonData = async () => {
      let res = await getAllPokemon(initialURL);
      loadPokemon(res.results)
      console.log(res)
      setNextURL(res.next)
      setPrevURL(res.previous)
      setLoading(false);
    };
    fetchPokemonData()
  }, [])
  
  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord
      })
    )
    setPokemonData(_pokemonData)
  }

//console.log(pokemonData)

const handlePrevPage = async () => {
  if(!prevURL) return;
  setLoading(true)
  let data = await getAllPokemon(prevURL)
  loadPokemon(data.results)
  setNextURL(data.next)
  setPrevURL(data.previous)
  setLoading(false)
}
const handleNextPage = async () => {  
  setLoading(true)
  let data = await getAllPokemon(nextURL)
  console.log(data)
  loadPokemon(data.results)
  setNextURL(data.next)
  setPrevURL(data.previous)
  setLoading(false)
}

  return (
  <>
  <Navbar />
  <div className="App">
    {loading ? (<h1>ロード中・・・</h1>):(
      <>
        <div className="pokemonCardContariner">
          {pokemonData.map((pokemon, i) => {
            return <Card key={i} pokemon={pokemon} />
          })}
        </div>
        <div className="btn">
          <button onClick={handlePrevPage}>前へ</button>
          <button onClick={handleNextPage}>次へ</button>
        </div>
      </>
    )}
  </div>;
  </>
  )
}

export default App;
