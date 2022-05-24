const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false, 
    carrinho: [],
    carrinhoAtivo: false,
    mensagemAlerta: "Item adicionado",
    alertaAtivo: false,
  },
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString('pt-BR', {style: "currency", currency: "BRL"});
    }
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if(this.carrinho.length) {
        this.carrinho.forEach(i => {
          total += i.preco;
        });
      }
      return total;
    }
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then(r => r.json())
        .then(r => {
          this.produtos = r;
        })
        .catch(erro => {
          console.log(Error(erro));
        })
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then(r => r.json())
        .then(r => {
          this.produto = r;
        })
        .catch(erro => {
          console.log(Error(erro));
        })
    },
    abrirModal(id) {
      this.fetchProduto(id);
      window.scroll({
        top: 0,
        behavior: 'smooth'
      })
    },
    fecharModal({target, currentTarget}) {
      target === currentTarget ? this.produto = false : null
    },
    clickForaCarrinho({ target, currentTarget }) {
      if (target === currentTarget) this.carrinhoAtivo = false;
    },
    adicionarItem() {
       this.produto.estoque--;
       const { id, nome, preco } = this.produto;
       this.carrinho.push({
         id, nome, preco
       }); 
       this.alerta(`${nome} foi adicionado!`);
    },
    removerItem(index) {
      this.carrinho.splice(index, 1); 
      console.log(index);
      console.log(this.carrinho); 
      this.alerta("produto removido!");
    },
    checarLocalStorage() {
      this.carrinho = JSON.parse(window.localStorage.carrinho);
    },
    compararEstoque() {
      const items = this.carrinho.filter(({ id }) => id === this.produto.id);
      this.produto.estoque -= items.length;
    },
    alerta(mensagem) {
      this.alertaAtivo = true;
      this.mensagemAlerta = mensagem;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1500);
    },
    router() {
      const hash = window.location.hash.replace("#", "");
      console.log(hash);
      hash ? this.fetchProduto(hash) : null;
    },

  },
  watch: {
    produto() {
      document.title = this.produto.nome || "Techno";
      const hash = this.produto.id || "";
      history.pushState(null, null, `#${hash}`);
      if (this.produto) {
        this.compararEstoque();
      }
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    }
  },
  created() {
    this.router();
    this.fetchProdutos();
    this.checarLocalStorage();
  }
});