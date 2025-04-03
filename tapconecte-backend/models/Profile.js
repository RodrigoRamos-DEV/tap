const { DataTypes } = require('sequelize');
const { sequelize } = require('./Index');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');

const Profile = sequelize.define('Profile', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'O nome é obrigatório'
      },
      len: {
        args: [2, 100],
        msg: 'O nome deve ter entre 2 e 100 caracteres'
      }
    }
  },
  instagram: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Instagram deve ser uma URL válida'
      }
    }
  },
  facebook: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Facebook deve ser uma URL válida'
      }
    }
  },
  whatsapp: {
    type: DataTypes.STRING,
    validate: {
      is: {
        args: /^(\+?\d{1,3}[- ]?)?\d{10,15}$/,
        msg: 'WhatsApp deve ser um número válido'
      }
    }
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      is: {
        args: /^(\+?\d{1,3}[- ]?)?\d{10,15}$/,
        msg: 'Telefone deve ser um número válido'
      }
    }
  },
  address: DataTypes.TEXT,
  logo: {
    type: DataTypes.STRING,
    get() {
      const logoPath = this.getDataValue('logo');
      return logoPath ? `${process.env.BASE_URL}${logoPath}` : null;
    }
  },
  pixKey: DataTypes.STRING,
  website: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Website deve ser uma URL válida'
      }
    }
  },
  about: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 500],
        msg: 'A descrição deve ter no máximo 500 caracteres'
      }
    }
  },
  bgColor: {
    type: DataTypes.STRING,
    defaultValue: '#FFFFFF',
    validate: {
      isHexColor: {
        msg: 'Cor de fundo deve ser um valor hexadecimal válido'
      }
    }
  },
  labelBgColor: {
    type: DataTypes.STRING,
    defaultValue: '#F0F0F0',
    validate: {
      isHexColor: {
        msg: 'Cor dos rótulos deve ser um valor hexadecimal válido'
      }
    }
  },
  fontColor: {
    type: DataTypes.STRING,
    defaultValue: '#000000',
    validate: {
      isHexColor: {
        msg: 'Cor da fonte deve ser um valor hexadecimal válido'
      }
    }
  },
  bgImage: {
    type: DataTypes.STRING,
    get() {
      const bgImagePath = this.getDataValue('bgImage');
      return bgImagePath ? `${process.env.BASE_URL}${bgImagePath}` : null;
    }
  },
  carouselImages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    get() {
      const images = this.getDataValue('carouselImages');
      return images.map(img => img ? `${process.env.BASE_URL}${img}` : null);
    }
  },
  linkedin: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'LinkedIn deve ser uma URL válida'
      }
    }
  },
  youtube: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'YouTube deve ser uma URL válida'
      }
    }
  },
  tiktok: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'TikTok deve ser uma URL válida'
      }
    }
  },
  kway: DataTypes.STRING,
  x: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'X (Twitter) deve ser uma URL válida'
      }
    }
  },
  twitch: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Twitch deve ser uma URL válida'
      }
    }
  },
  selectedFont: {
    type: DataTypes.STRING,
    defaultValue: 'Arial',
    validate: {
      isIn: {
        args: [['Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins']],
        msg: 'Fonte selecionada não é válida'
      }
    }
  },
  slug: {
    type: DataTypes.STRING,
    unique: true
  }
}, {
  timestamps: true,
  paranoid: true, // Para soft delete
  hooks: {
    beforeValidate: (profile) => {
      if (profile.name && !profile.slug) {
        profile.slug = `${slugify(profile.name, { 
          lower: true,
          remove: /[*+~.()'"!:@]/g
        })}-${Math.random().toString(36).substr(2, 5)}`;
      }
    },
    afterDestroy: (profile) => {
      // Remove arquivos quando o perfil é deletado
      if (profile.logo) {
        fs.unlinkSync(path.join(__dirname, '..', 'public', profile.logo));
      }
      if (profile.bgImage) {
        fs.unlinkSync(path.join(__dirname, '..', 'public', profile.bgImage));
      }
      profile.carouselImages.forEach(image => {
        if (image) {
          fs.unlinkSync(path.join(__dirname, '..', 'public', image));
        }
      });
    }
  }
});

// Método de instância para obter links sociais formatados
Profile.prototype.getSocialLinks = function() {
  return {
    instagram: this.instagram,
    facebook: this.facebook,
    whatsapp: `https://wa.me/${this.whatsapp}`,
    linkedin: this.linkedin,
    youtube: this.youtube,
    tiktok: this.tiktok,
    x: this.x,
    twitch: this.twitch,
    website: this.website
  };
};

// Método para atualizar imagens
Profile.prototype.updateImages = async function(files) {
  if (files.logo) {
    if (this.logo) {
      fs.unlinkSync(path.join(__dirname, '..', 'public', this.logo));
    }
    this.logo = `/uploads/${files.logo[0].filename}`;
  }
  
  if (files.bgImage) {
    if (this.bgImage) {
      fs.unlinkSync(path.join(__dirname, '..', 'public', this.bgImage));
    }
    this.bgImage = `/uploads/${files.bgImage[0].filename}`;
  }
  
  if (files.carouselImages) {
    // Remove imagens antigas
    this.carouselImages.forEach(image => {
      if (image) {
        fs.unlinkSync(path.join(__dirname, '..', 'public', image));
      }
    });
    
    // Adiciona novas imagens
    this.carouselImages = files.carouselImages.map(file => `/uploads/${file.filename}`);
  }
  
  await this.save();
};

module.exports = Profile;