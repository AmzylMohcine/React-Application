import React, { useEffect, useState } from "react"

function Test(props) {
  const [pets, setPets] = useState([])
  //only run ones the first time the components is rendred
  useEffect(function () {
    if (localStorage.getItem("exemplePetData")) {
      setPets(JSON.parse(localStorage.getItem("exemplePetData")))
    }
  }, [])

  //run every time our pet changes

  useEffect(
    function () {
      localStorage.setItem("exemplePetData", JSON.stringify(pets))
    },
    [pets]
  )

  const prix = 8
  const [totalcmd, setTotalcmd] = useState(0)
  const [numberBuy, setNumberBuy] = useState(0)
  const [likes, setLikes] = useState(0)
  const [bl, setBl] = useState(5)

  function increaseMe() {
    setLikes(previous => {
      return previous + 1
    })
  }
  function decreaseMe() {
    setLikes(decreaseMe => {
      if (decreaseMe > 0) {
        setBl(prev => {
          return prev - 1
        })
        return decreaseMe - 1
      }
      return 0
    })
  }
  function Additem() {
    setTotalcmd(total => {
      return total + 1
    })
    setNumberBuy(prev => {
      return prev + 1
    })
  }
  function removeItem() {
    setTotalcmd(total => {
      if (total > 0) {
        return total - 1
      }
      return 0
    })
    setNumberBuy(prev => {
      if (prev > 0) {
        return prev - 1
      }
      return 0
    })
  }

  function TimeArea() {
    const [time, setTime] = useState(new Date().toLocaleString())

    useEffect(() => {
      const interval = setInterval(() => setTime(new Date().toLocaleString()), 1000)

      return () => clearInterval(interval)
    }, [])
    return (
      <div>
        <p>the time is {time} </p>
      </div>
    )
  }

  function Pet(props) {
    function deletePet(e) {
      e.preventDefault()
      props.setPets(prev => prev.filter(pet => pet.id != props.id))
    }
    return (
      <li>
        {" "}
        {props.name} is a {props.species} and is {props.age} years old
        {"  "}
        <button onClick={deletePet}> Delete </button>
      </li>
    )
  }

  function AddPetForm(props) {
    const [name, setName] = useState()
    const [species, setSpecies] = useState()
    const [age, setAge] = useState()
    function handleForm(e) {
      e.preventDefault()
      setPets(prev => prev.concat({ name, species: species, age: age, id: Date.now() }))
    }
    return (
      <form onSubmit={handleForm}>
        <fieldset>
          <legend>Add New Pet</legend>
          <input onChange={e => setName(e.target.value)} placeholder="Name" />
          <input onChange={e => setSpecies(e.target.value)} placeholder="species" />
          <input onChange={e => setAge(e.target.value)} placeholder="age in years" />
          <button>Add Pet</button>
        </fieldset>
      </form>
    )
  }

  return (
    <>
      <TimeArea />
      <h1> Hello this is {likes} likes </h1>
      <h2> {bl} </h2>
      <button onClick={increaseMe}> Increase me </button> <button onClick={decreaseMe}> Decrease likes </button>
      <p> Le prix est {prix}$</p>
      <button onClick={Additem}> Ajouter au panier </button>
      <button onClick={removeItem}> enlever du panier </button>
      <p> Nombre d'achat {numberBuy} </p>
      <div>Total de commande : {totalcmd * prix}</div>
      <AddPetForm setPets={setPets} />
      <div>
        {" "}
        <h1> This is list of pets </h1>
      </div>
      <div>
        {pets.map(pet => (
          <Pet name={pet.name} species={pet.species} age={pet.age} id={pet.id} key={pet.id} setPets={setPets} />
        ))}
      </div>
    </>
  )
}

export default Test
