import React, {useState, createRef} from 'react';
import './SearchPage.css';
import SearchData from '../data/mock-airports.json';
import options from '../data/mock-flights.json';
import calculateCost from '../helpers/calculateCost';


export default function SearchPage() {
    const [queryDeparture, setQueryDeparture] = useState('');
    const [queryArrival, setQueryArrival] = useState('');
    const [pickedFlight, setPickedFlight] = useState("amsterdam");
    const [airportNameArrival, setAirportNameArrival] = useState('los angeles');
    const [departDate, setDepartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [visibility, setVisibility] = useState(true);
    const [personaliaVisibility, setPersonaliaVisibility] = useState(true);
    const [luxury, setLuxury] = useState('');
    const [formPassengers, setFormPassengers] = useState(0);
    const [formName, setFormName] = useState('');
    const [formAddress, setFormAddress] = useState('');
    const [formPhonenr, setFormPhonenr] = useState('');
    const [formIdentification, setFormIdentification] = useState('');
    const [grandTotal, setGrandTotal] = useState(0);
    const [formOrderState, setFormOrderState] = useState(false);
    const [formSubmitState, setFormSubmitState] = useState(false);

    let pickedFlightCityRef = createRef();
    let airportNameArrivalRef = createRef();
    let grandTotalRef = createRef();

    // console.log("mock zoek data:", SearchData);
    // console.log("zoekopdracht vertrek: ", queryDeparture);
    // console.log("zoekopdracht aankomst: ", queryArrival);

    //functies voor radiobuttons
    function handleAirportDepartureSelect(event) {
        setPickedFlight(event.target.value);
        console.log("vertrekstad:", pickedFlight);
        // radioButtonDepartRef.current.value = null;
    }

    function handleAirportArrivalSelect(event) {
        setAirportNameArrival(event.target.value);
        console.log("aankomststad:", airportNameArrival);
    }

    //functie voor select/dropdown
    function handleluxuryChange(event) {
        setLuxury(event.target.value);
        console.log("Luxe toeslag factor: *", event.target.value);
    }

    function handleOrder() {
        console.log("Persoonsgegevens ingevuld:");
        setFormOrderState(true);
        setVisibility(false);
        setTimeout(() => {
            window.scrollTo({top: 0, behavior: 'smooth'})
        }, 0);
    }

    //weten of de inputs allemaal werken:
    function handleSubmit(e) {
        setFormSubmitState(true);
        setPersonaliaVisibility(false);
        setTimeout(() => {
            window.scrollTo({top: 0, behavior: 'smooth'})
        }, 0);
        e.preventDefault();
        console.log("vertrekplaats", pickedFlight, "aankomstplaats", airportNameArrival, "personen", formPassengers, "vertrekDatum", departDate, "aankomstDatum:", returnDate, "bedrag: ", grandTotal);
    }

    return (

        <>
            <form>
                <fieldset className={visibility ? "show" : "hidden"}>

                    <section className="search-airport">
                        <h2>Vertrek & aankomst</h2>
                        <h4>Zodra je begint met typen, zie je meteen de zoekresultaten verschijnen,
                            waarvan je er dan 1 kunt selecteren.</h4>

                        <div className="inner">
                            <div className="column">
                                <label htmlFor="departure">Zoek plaats van vertrek:</label>
                                <input placeholder="Type hier AMS en klik op SCHIPHOL optie"
                                       onChange={event => setQueryDeparture(event.target.value)}/>

                                {
                                    SearchData.filter(postDeparture => {
                                        if (queryDeparture === '') {
                                            //alleen iets tonen waneer er iets getypt wordt
                                            return null;
                                        } else if
                                        (postDeparture.address.cityName.toLowerCase().includes(queryDeparture.toLowerCase())) {
                                            // console.log(postDeparture.address.cityName);
                                            return postDeparture;
                                        }
                                    }).map((postDeparture, index) => (

                                        <div className="box" key={index}>
                                            <label htmlFor={postDeparture.iataCode}>
                                                <input type="radio"
                                                       ref={pickedFlightCityRef}
                                                       id={postDeparture.iataCode}
                                                       name="airport_departure"
                                                       value={postDeparture.address.cityName}
                                                       checked={pickedFlight === postDeparture.address.cityName}
                                                       onChange={handleAirportDepartureSelect}
                                                />
                                                <p>{postDeparture.name}<br/>
                                                    {postDeparture.address.cityName}<br/>
                                                    {postDeparture.iataCode}<br/>
                                                    {postDeparture.cost.score && postDeparture.cost.score}
                                                </p>
                                            </label>
                                        </div>

                                    ))
                                }
                            </div>

                            <div className="column">
                                <label htmlFor="arrival">Zoek plaats van aankomst:</label>
                                <input placeholder="Type hier LOS en klik op LOS ANGELES optie"
                                       onChange={event => setQueryArrival(event.target.value)}/>

                                {
                                    SearchData.filter(postArrival => {
                                        if (queryArrival === '') {
                                            //niets tonen waneer er niets getypt wordt
                                            return null;
                                        } else if (postArrival.address.cityName.toLowerCase().includes(queryArrival.toLowerCase())) {
                                            console.log(postArrival.address.cityName);
                                            return postArrival;
                                        }
                                    }).map((postArrival, index) => (

                                        <div className="box" key={index}>
                                            <label htmlFor={postArrival.iataCode}>
                                                <input type="radio"
                                                       ref={airportNameArrivalRef}
                                                       id={postArrival.iataCode}
                                                       name="airport_arrival"
                                                       value={postArrival.address.cityName}
                                                       checked={airportNameArrival === postArrival.address.cityName}
                                                       onChange={handleAirportArrivalSelect}
                                                />
                                                <p>{postArrival.name}<br/>
                                                 {postArrival.address.cityName}<br/>
                                                 {postArrival.iataCode}<br/>
                                                 {postArrival.cost.score && postArrival.cost.score}</p>
                                            </label>
                                        </div>

                                    ))
                                }
                            </div>
                        </div>

                    </section>


                    <section className="flight-date-persons">
                        <p>↑ selecteer hier 1 vertrek en 1 aankomst plaats.</p>
                        <label htmlFor="departure">Kies vertrekdatum: </label>
                        <input type="date"
                               onChange={(e) => setDepartDate(e.target.value)}
                               id="departure"
                               name="departure"
                               required/><br/>
                        <label htmlFor="return">Kies aankomstdatum: </label>
                        <input type="date"
                               onChange={(e) => setReturnDate(e.target.value)}
                               id="return"
                               name="return"/><br/>

                        <label htmlFor="passengers">Aantal personen: </label>
                        <input
                            type="number"
                            name="passengers"
                            id="passengers"
                            placeholder={1}
                            min="1" max="7"
                            value={formPassengers}
                            onChange={(e) => setFormPassengers(parseInt(e.target.value))}
                        /><br/>

                        <button
                            type="button"
                            name="order"
                            onClick={handleOrder}
                        >ZOEKEN
                        </button>

                    </section>
                </fieldset>

                {formOrderState ?
                    <>
                        <fieldset className={personaliaVisibility ? "show" : "hidden"}>
                            <section>
                                <h2>Selecteer vlucht</h2>
                                <p>Vluchtlocaties
                                    <br/>van: <span className="capitalize">{queryDeparture
                                    && queryDeparture}</span> naar: <span
                                        className="capitalize">{airportNameArrival
                                    && airportNameArrival}</span></p>
                                <br/>
                                <p><label htmlFor="luxury" className="biglabel">Kies vluchtoptie:
                                    <select value={luxury} onChange={handleluxuryChange}>
                                        {options.map((option, index) => (
                                            <option value={option.value}
                                                    key={index}>{option.label}</option>
                                        ))
                                        }
                                    </select>
                                </label></p>
                                <br/>

                                <h2>Prijs</h2>
                                <p className="cost">Prijs van
                                    selectie met klassefactor {luxury && luxury}:
                                    <br/>
                                    <strong>&#128176; &nbsp;
                                        <span className="bigtext">&euro;
                                            <span
                                                ref={grandTotalRef}
                                                onChange={(e) => setGrandTotal(e.target.value)}
                                            >{calculateCost(SearchData[0].cost.score,
                                                SearchData[7].cost.score) * luxury}</span>
                                            ,-</span>
                                    </strong>
                                    <br/>= van {pickedFlight && pickedFlight} naar {airportNameArrival
                                    && airportNameArrival}</p>
                                <p><br/>VertrekDatum: {departDate}<br/>
                                    AankomstDatum: {returnDate}<br/>
                                    Aantal personen: {formPassengers}</p>

                            </section>
                            <section>
                                <h2>Vul je gegevens in</h2>
                                <label htmlFor="fullname">
                                    Volledige naam:
                                    <input
                                        type="text"
                                        name="fullname"
                                        placeholder="voornaam achternaam"
                                        id="fullname"
                                        className={formName.length < 4 ? 'input-error' : 'input-normal'}
                                        value={formName}
                                        onChange={(e) => setFormName(e.target.value)}
                                    />
                                    {formName.length < 4
                                    &&
                                    <p className="error-message">Deze naam is te kort! Typ volledige
                                        naam in</p>}
                                </label>
                                <br/>
                                <label htmlFor="address">
                                    Volledig adres:
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="(stad, land)"
                                        id="address"
                                        value={formAddress}
                                        onChange={(e) => setFormAddress(e.target.value)}
                                    />
                                </label>
                                <br/>
                                <label htmlFor="phonenumber">
                                    Telefoon:
                                    <input
                                        type="text"
                                        name="phonenumber"
                                        placeholder="06-12345678"
                                        id="phonenumber"
                                        value={formPhonenr}
                                        onChange={(e) => setFormPhonenr(e.target.value)}
                                    />
                                </label>
                                <br/>
                                <label htmlFor="identification">
                                    ID nummer:
                                    <input
                                        type="text"
                                        name="identification"
                                        placeholder="paspoortnummer"
                                        id="identification"
                                        value={formIdentification}
                                        onChange={(e) => setFormIdentification(e.target.value)}
                                    />
                                </label>
                                <br/>
                            </section>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                            >
                                VLUCHT SELECTEREN
                            </button>
                        </fieldset>
                    </>
                    :
                    <>
                        <hr/>
                        <p>Klik op 'zoeken', om daarna je persoonsgegevens in te kunnen vullen.</p>
                    </>}
            </form>


            {formSubmitState ?
                <div className="box booking">
                    <h2>Bestelling/Boeking</h2>
                    <p><strong>Dit heb je besteld/geboekt:</strong></p>
                    <p>Geboekte vlucht van: <span className="capitalize">{pickedFlight
                    && pickedFlight}</span>,<br/>
                        naar: <span className="capitalize">{airportNameArrival
                        && airportNameArrival}</span>,<br/>
                        aantal personen: {formPassengers},<br/>
                        vertrekDatum: {departDate},<br/>
                        aankomstDatum: {returnDate},
                        <br/><br/>Totaalprijs: &euro;
                        <strong>{calculateCost(SearchData[0].cost.score,
                            SearchData[7].cost.score) * luxury}</strong>
                        ,-<br/><br/>
                        Naam: {formName},<br/>
                        Adres: {formAddress},<br/>
                        Telefoon: {formPhonenr},<br/>
                        ID nummer: {formIdentification}.
                    </p>
                </div>

                :
                <>
                    <hr/>
                    <p>Klik op 'vlucht selecteren', om de bevestiging van je bestelling te
                        bekijken.</p>
                    <hr/>
                </>}


        </>

    )

};