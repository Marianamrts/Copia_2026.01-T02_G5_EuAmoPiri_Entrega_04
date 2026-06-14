import React from 'react';
import './SobrePiriPage.css';

export default function SobrePiriPage() {
  return (
    <div className="sobre-piri-container">
      <div className="top-navigation">
        <button className="btn-amopiri"> ❤︎EuAmoPiri </button>
      </div>

      <div className="grid-layout-piri">
        <div className="coluna-conteudo">
          
          <section className="card-informativo">
            <h2>Origem da cidade de Pirenópolis</h2>
            <p>
              Pirenópolis foi fundada in 1727, durante o ciclo do ouro, quando bandeirantes 
              chegaram à região em busca de riquezas minerais. O local ficou conhecido como Meia Ponte, 
              tornando-se um importante arraial de garimpo. O crescimento foi rápido, impulsionado pela 
              exploração do ouro e pela chegada de novos moradores. Com o passar do tempo, a região 
              começou a se estruturar com a construção de igrejas, casarões e ruas de pedra, formando 
              a base do atual centro histórico.
            </p>
            <div className="galeria-origem">
              <img src="https://via.placeholder.com/250x150" alt="Piri Antiga 1" className="img-piri" />
              <img src="https://via.placeholder.com/250x150" alt="Piri Antiga 2" className="img-piri" />
            </div>
          </section>

          <section className="card-informativo">
            <h2>História</h2>
            <p>
              Com o esgotamento do ouro, no final do século XVIII, a cidade passou por uma mudança econômica, 
              voltando-se para a agricultura, pecuária e comércio. Em 1890, recebeu o nome de Pirenópolis, 
              inspirado na Serra dos Pireneus. Mesmo com essas mudanças, preservou sua arquitetura colonial 
              e tradições culturais ao longo dos anos.
            </p>
          </section>

          <section className="card-informativo">
            <h2>Atualidade</h2>
            <p>
              Atualmente, Pirenópolis é um dos destinos turísticos mais procurados de Goiás. A cidade se destaca 
              por seu centro histórico preservado, suas cachoeiras e paisagens naturais, além de festas 
              tradicionais como as Cavalhadas, que reforçam sua identidade cultural e histórica.
            </p>
          </section>

        </div>

        <div className="coluna-lateral">
          <div className="card-lateral-fotos">
            <h3>Registros Históricos</h3>
            <img src="https://via.placeholder.com/300x200" alt="Igreja Matriz" className="img-piri" />
            <img src="https://via.placeholder.com/300x200" alt="Cachoeira de Piri" className="img-piri" />
            <img src="https://via.placeholder.com/300x200" alt="Ruas de Pedra" className="img-piri" />
          </div>
        </div>
      </div>
    </div>
  );
}
